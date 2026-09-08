/* Drifin Slot — Vehicle Engine 4.3.0
 * Advanced data-driven arcade vehicle dynamics with responsive steering,
 * progressive drift physics, suspension compliance & weight transfer.
 * No dependencies: safe for PWA cache and Capacitor Android.
 */
(function (global) {
  'use strict';

  const clamp = (v, min, max) => v < min ? min : v > max ? max : v;
  const smooth = (rate, dt) => 1 - Math.exp(-rate * Math.max(0, dt));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Tune here when adding or balancing a vehicle. Progression data remains in index.html.
  const PROFILES = {
    0: {
      key: 'balanced', tag: 'DRIFT BALANCEADO',
      speedMultiplier: 1, handling: 1, nitroEfficiency: 1,
      acceleration: 13.5, deceleration: 32, nitroAcceleration: 27,
      steeringForce: 45, steeringUpgrade: 6.5, lateralGain: .78,
      dryGrip: .92, wetGrip: .74, brakeGrip: .68, airGrip: 1,
      lateralDamping: 8.2, wetDamping: 1.15, airDamping: 2.2,
      driftScale: 420, visualSteer: .40, visualDrift: .36,
      rollScale: .085, brakeRoll: .07, pitchScale: .016, brakePitch: .068,
      weightX: .022, weightZ: .010, suspensionTravel: .065, suspensionResponse: 11,
      wheelBase: 2.82, steerResponse: 11.5, cornerGrip: 1.05,
      driftFriction: 0.94, driftTrigger: 0.16,
      visual: { body: 'gt', wheelScale: 1.0, track: 1.0, roof: 1.0, aero: .72, ride: .02, stripe: .62 }
    },
    1: {
      key: 'agile', tag: 'DRIFT ÁGIL',
      speedMultiplier: .95, handling: 1.28, nitroEfficiency: 1,
      acceleration: 15.2, deceleration: 34, nitroAcceleration: 27.5,
      steeringForce: 47, steeringUpgrade: 7.2, lateralGain: .84,
      dryGrip: .96, wetGrip: .78, brakeGrip: .72, airGrip: 1,
      lateralDamping: 8.9, wetDamping: 1.0, airDamping: 2.1,
      driftScale: 390, visualSteer: .44, visualDrift: .32,
      rollScale: .078, brakeRoll: .062, pitchScale: .014, brakePitch: .062,
      weightX: .019, weightZ: .008, suspensionTravel: .058, suspensionResponse: 13,
      wheelBase: 2.62, steerResponse: 13.8, cornerGrip: 1.14,
      driftFriction: 0.96, driftTrigger: 0.14,
      visual: { body: 'hatch', wheelScale: .94, track: .97, roof: 1.08, aero: .42, ride: .04, stripe: .56 }
    },
    2: {
      key: 'speed', tag: 'DRIFT VELOCIDADE',
      speedMultiplier: 1.14, handling: .92, nitroEfficiency: 1.18,
      acceleration: 12.8, deceleration: 30, nitroAcceleration: 26.5,
      steeringForce: 43, steeringUpgrade: 5.8, lateralGain: .70,
      dryGrip: .88, wetGrip: .68, brakeGrip: .63, airGrip: 1,
      lateralDamping: 7.5, wetDamping: 1.3, airDamping: 2.4,
      driftScale: 460, visualSteer: .36, visualDrift: .38,
      rollScale: .092, brakeRoll: .075, pitchScale: .018, brakePitch: .072,
      weightX: .024, weightZ: .011, suspensionTravel: .070, suspensionResponse: 9.5,
      wheelBase: 2.94, steerResponse: 9.8, cornerGrip: .98,
      driftFriction: 0.92, driftTrigger: 0.18,
      visual: { body: 'coupe', wheelScale: 1.03, track: 1.04, roof: .88, aero: .9, ride: .015, stripe: .58 }
    },
    3: {
      key: 'heavy', tag: 'DRIFT BLINDADO',
      speedMultiplier: .93, handling: .98, nitroEfficiency: .98,
      acceleration: 12.4, deceleration: 36, nitroAcceleration: 28,
      steeringForce: 46, steeringUpgrade: 6.2, lateralGain: .72,
      dryGrip: .99, wetGrip: .84, brakeGrip: .80, airGrip: 1,
      lateralDamping: 9.8, wetDamping: .85, airDamping: 2.6,
      driftScale: 490, visualSteer: .34, visualDrift: .30,
      rollScale: .068, brakeRoll: .052, pitchScale: .014, brakePitch: .056,
      weightX: .017, weightZ: .007, suspensionTravel: .052, suspensionResponse: 14,
      wheelBase: 3.12, steerResponse: 8.8, cornerGrip: 1.20,
      driftFriction: 0.97, driftTrigger: 0.20,
      visual: { body: 'armor', wheelScale: 1.08, track: 1.09, roof: 1.14, aero: 1.02, ride: -.015, stripe: .72 }
    },
    4: {
      key: 'phantom', tag: 'DRIFT COMPLETO',
      speedMultiplier: 1.12, handling: 1.18, nitroEfficiency: 1.22,
      acceleration: 14.8, deceleration: 33, nitroAcceleration: 29,
      steeringForce: 47, steeringUpgrade: 7.0, lateralGain: .80,
      dryGrip: .97, wetGrip: .80, brakeGrip: .74, airGrip: 1,
      lateralDamping: 8.8, wetDamping: .95, airDamping: 2.2,
      driftScale: 410, visualSteer: .42, visualDrift: .34,
      rollScale: .074, brakeRoll: .058, pitchScale: .015, brakePitch: .062,
      weightX: .020, weightZ: .008, suspensionTravel: .060, suspensionResponse: 12,
      wheelBase: 2.98, steerResponse: 12.0, cornerGrip: 1.10,
      driftFriction: 0.95, driftTrigger: 0.15,
      visual: { body: 'phantom', wheelScale: 1.01, track: 1.06, roof: .96, aero: 1.22, ride: 0, stripe: .64 }
    }
  };

  const DEFAULT_PROFILE = PROFILES[0];

  class DrifinVehicleEngine {
    constructor(profileMap) {
      this.profiles = profileMap || PROFILES;
      this.profile = DEFAULT_PROFILE;
      this.profileId = 0;
      this.steerState = 0;
      this.suspension = 0;
      this.yawRate = 0;
      this.slipAngle = 0;
      this.driftIntensity = 0;
      this.bodyRoll = 0;
      this.bodyPitch = 0;
    }

    profileFor(id) {
      return this.profiles[id] || this.profiles[0] || DEFAULT_PROFILE;
    }

    configure(carOrId) {
      const id = typeof carOrId === 'object' ? carOrId.id : carOrId;
      this.profileId = Number.isFinite(id) ? id : 0;
      this.profile = this.profileFor(this.profileId);
      this.steerState = 0;
      this.suspension = 0;
      this.yawRate = 0;
      this.slipAngle = 0;
      this.driftIntensity = 0;
      this.bodyRoll = 0;
      this.bodyPitch = 0;
      return this.profile;
    }

    step(input) {
      const p = this.profile || DEFAULT_PROFILE;
      const dt = Math.max(0, input.dt || 0);
      const playing = !!input.playing;
      const demo = !!input.demo;
      const brake = !!input.brake && playing;
      const wet = !!input.wet;
      const airborne = !!input.airborne;
      const upgrade = Math.max(0, input.handlingUpgrade || 0);
      const speedLimit = Math.max(1, input.speedLimit || 44);
      const distance = Math.max(0, input.distance || 0);
      let base = Math.min(22 + distance * .008, speedLimit) * p.speedMultiplier;
      if (wet) base *= .9;
      if (demo) base = 24;

      const nitroHeld = !!input.nitroHeld;
      const nitroAvailable = Math.max(0, input.nitro || 0);
      const nitroOn = playing && nitroHeld && nitroAvailable > 0 && !brake;
      let target = base * (nitroOn ? 1.55 : 1) + (playing && input.accelerate ? 2 : 0);
      if (brake) target = base * .35;
      if (input.mode === 'count' || input.mode === 'crashed') target = 0;

      const currentSpeed = Math.max(0, input.speed || 0);
      const acceleration = nitroOn ? p.nitroAcceleration : target > currentSpeed ? p.acceleration : p.deceleration;
      const nextSpeed = Math.max(0, currentSpeed + clamp(target - currentSpeed, -acceleration * dt, acceleration * dt * (input.mode === 'count' ? 3 : 1)));
      const nextNitro = nitroOn ? Math.max(0, nitroAvailable - 28 / Math.max(.1, p.nitroEfficiency) * dt) : nitroAvailable;

      // Progressive steering input with smooth response and center spring feel
      let rawSteer = clamp(input.steerInput || 0, -1, 1);
      // S-curve response for finer control around center and assertive bite at extremes
      const steerShaped = Math.sign(rawSteer) * Math.pow(Math.abs(rawSteer), 1.25);
      const steerResponse = (p.steerResponse || 10) * (airborne ? 0.45 : 1.0);
      this.steerState += (steerShaped - this.steerState) * smooth(steerResponse, dt);

      // Road grip calculation with dynamic surface interaction
      const baseGrip = airborne ? p.airGrip : wet ? p.wetGrip : brake ? p.brakeGrip : p.dryGrip;
      const roadGrip = baseGrip * (p.cornerGrip || 1.0);

      // Speed-dependent steering agility: high responsiveness at drift initiation speeds
      const speedFactor = clamp(nextSpeed / 28, 0.4, 1.25);
      const steeringForce = (p.steeringForce + upgrade * p.steeringUpgrade) * p.handling;

      // Dynamic cornering load and yaw inertia
      const cornerDemand = clamp(Math.abs(this.steerState) * speedFactor * (nextSpeed / Math.max(1, p.wheelBase)) * .20, 0, 1.4);
      const targetYawRate = airborne ? 0 : this.steerState * speedFactor * roadGrip * (0.75 + cornerDemand * 0.35) / Math.max(1, p.wheelBase);
      this.yawRate += (targetYawRate - this.yawRate) * smooth(9.5, dt);

      // Lateral velocity integration with realistic tire adhesion limits
      let lateralVelocity = input.lateralVelocity || 0;
      const lateralGripMult = airborne ? 0.22 : p.lateralGain;
      const gripLoss = brake ? 0.32 : Math.min(0.28, cornerDemand * 0.18);
      const lateralForce = steeringForce * lateralGripMult * (1 - gripLoss);

      lateralVelocity += this.steerState * lateralForce * speedFactor * roadGrip * dt;

      // Lateral damping (tire friction counteracting slide)
      const currentDamping = airborne ? p.airDamping : p.lateralDamping * roadGrip;
      lateralVelocity *= Math.exp(-currentDamping * dt);
      if (wet && Math.abs(lateralVelocity) > 0.8) lateralVelocity *= Math.exp(-p.wetDamping * dt);

      // True slip angle: angle between vehicle heading and vehicle velocity vector
      const forwardVelocity = Math.max(nextSpeed, 3);
      const rawSlipAngle = Math.atan2(lateralVelocity, forwardVelocity) - this.yawRate * 0.22;
      this.slipAngle += (rawSlipAngle - this.slipAngle) * smooth(7.5, dt);

      // Drift calculation: triggers smoothly when lateral slide and slip angle exceed grip threshold
      const rawDrift = (Math.abs(lateralVelocity) * nextSpeed * (1 + Math.abs(this.slipAngle) * 1.2)) / (p.driftScale || 450);
      const driftThreshold = p.driftTrigger || 0.16;
      const targetDriftIntensity = rawDrift > driftThreshold ? clamp((rawDrift - driftThreshold) * 1.8, 0, 1.5) : 0;
      this.driftIntensity += (targetDriftIntensity - this.driftIntensity) * smooth(6.0, dt);

      const cornerLoad = clamp(Math.abs(this.yawRate) * .75 + Math.abs(this.slipAngle) * 2.0 + Math.abs(this.steerState) * .15, 0, 1);

      // Steering target for visual wheel turn
      const steeringTarget = clamp(this.steerState * .48, -.48, .48);

      return {
        base,
        target,
        brake,
        nitroOn,
        nitro: nextNitro,
        speed: nextSpeed,
        steerPhys: this.steerState,
        steerTarget: steeringTarget,
        lateralVelocity,
        slipAngle: this.slipAngle,
        yawRate: this.yawRate,
        cornerLoad,
        drift: rawDrift,
        driftIntensity: this.driftIntensity,
        x: clamp((input.x || 0) + lateralVelocity * dt, -5.55, 5.55),
        roadGrip,
        profile: p
      };
    }

    visuals(input) {
      const p = this.profile || DEFAULT_PROFILE;
      const dt = Math.max(0, input.dt || 0);
      const lateralVelocity = input.lateralVelocity || 0;
      const speed = input.speed || 0;
      const target = input.targetSpeed || 0;
      const brake = !!input.brake;
      const airborne = !!input.airborne;
      const steer = input.steerVisual || 0;
      const slipAngle = input.slipAngle || Math.atan2(lateralVelocity, Math.max(speed, 4));
      const yawRate = input.yawRate || 0;
      const cornerLoad = clamp(input.cornerLoad || 0, 0, 1);

      // Body roll: Chassis leans toward outside of turn (centrifugal tilt)
      const rollTarget = clamp(
        -lateralVelocity * p.rollScale - yawRate * .11 + (brake ? steer * p.brakeRoll : 0),
        -.52, .52
      );

      // Body pitch: Nose dives under braking, squats under acceleration / nitro
      const accelDelta = target - speed;
      const pitchTarget = clamp(accelDelta * p.pitchScale, -.11, .14) + (brake ? p.brakePitch : 0) + (input.airPitch || 0);

      // Body yaw: Combines steering angle and drift slip angle for authentic drift posture
      const steerYaw = clamp(steer * p.visualSteer, -.26, .26);
      const driftYaw = clamp(slipAngle * p.visualDrift, -.22, .22);
      const yawTarget = clamp(steerYaw + driftYaw + yawRate * .10, -.36, .36);

      // Weight transfer on chassis
      const weightX = clamp(-lateralVelocity * p.weightX - yawRate * .022, -.13, .13);
      const weightZ = clamp(accelDelta * p.weightZ + cornerLoad * .014, -.07, .07);

      // Suspension deflection & wheel travel
      const load = clamp(
        Math.abs(lateralVelocity) * .04 + Math.abs(accelDelta) * .055 + cornerLoad * .36 + (brake ? .32 : 0) + (airborne ? .70 : 0),
        0, 1
      );
      this.suspension += (load - this.suspension) * smooth(p.suspensionResponse || 11, dt);
      const wheelLift = (this.suspension - .32) * p.suspensionTravel;

      // Dynamic counter-steer angle for front wheels when sliding/drifting
      const counterSteer = clamp(-slipAngle * 0.75 + steer * 0.35, -0.52, 0.52);

      return {
        rollTarget,
        pitchTarget,
        yawTarget,
        weightX,
        weightZ,
        wheelLift,
        counterSteer,
        suspension: this.suspension,
        profile: p
      };
    }
  }

  global.DRIFIN_VEHICLE_PROFILES = PROFILES;
  global.DrifinVehicleEngine = DrifinVehicleEngine;
})(window);

/* Drifin Slot — Vehicle Engine 4.1.0
 * Data-driven arcade vehicle dynamics.
 * No dependencies: safe for PWA cache and Capacitor Android.
 */
(function (global) {
  'use strict';

  const clamp = (v, min, max) => v < min ? min : v > max ? max : v;
  const smooth = (rate, dt) => 1 - Math.exp(-rate * Math.max(0, dt));

  // Tune here when adding or balancing a vehicle. Progression data remains in index.html.
  const PROFILES = {
    0: {
      key: 'balanced', tag: 'DRIFT BALANCEADO',
      speedMultiplier: 1, handling: 1, nitroEfficiency: 1,
      acceleration: 13, deceleration: 30, nitroAcceleration: 26,
      steeringForce: 42, steeringUpgrade: 6, lateralGain: .72,
      dryGrip: .90, wetGrip: .72, brakeGrip: .66, airGrip: 1,
      lateralDamping: 7.8, wetDamping: 1.2, airDamping: 2.4,
      driftScale: 500, visualSteer: .34, visualDrift: .28,
      rollScale: .07, brakeRoll: .06, pitchScale: .014, brakePitch: .06,
      weightX: .018, weightZ: .008, suspensionTravel: .055, suspensionResponse: 9,
      wheelBase: 2.82, steerResponse: 8.4, cornerGrip: 1.0,
      visual: { body: 'gt', wheelScale: 1.0, track: 1.0, roof: 1.0, aero: .72, ride: .02, stripe: .62 }
    },
    1: {
      key: 'agile', tag: 'DRIFT ÁGIL',
      speedMultiplier: .94, handling: 1.25, nitroEfficiency: 1,
      acceleration: 14.5, deceleration: 31, nitroAcceleration: 26,
      steeringForce: 42, steeringUpgrade: 6.8, lateralGain: .79,
      dryGrip: .94, wetGrip: .76, brakeGrip: .70, airGrip: 1,
      lateralDamping: 8.5, wetDamping: 1.05, airDamping: 2.3,
      driftScale: 470, visualSteer: .38, visualDrift: .25,
      rollScale: .065, brakeRoll: .055, pitchScale: .013, brakePitch: .055,
      weightX: .016, weightZ: .007, suspensionTravel: .048, suspensionResponse: 11,
      wheelBase: 2.62, steerResponse: 10.2, cornerGrip: 1.08,
      visual: { body: 'hatch', wheelScale: .94, track: .97, roof: 1.08, aero: .42, ride: .04, stripe: .56 }
    },
    2: {
      key: 'speed', tag: 'DRIFT VELOCIDADE',
      speedMultiplier: 1.12, handling: .88, nitroEfficiency: 1.15,
      acceleration: 12.3, deceleration: 29, nitroAcceleration: 25,
      steeringForce: 41, steeringUpgrade: 5.4, lateralGain: .66,
      dryGrip: .86, wetGrip: .66, brakeGrip: .61, airGrip: 1,
      lateralDamping: 7.2, wetDamping: 1.35, airDamping: 2.5,
      driftScale: 525, visualSteer: .31, visualDrift: .31,
      rollScale: .075, brakeRoll: .065, pitchScale: .015, brakePitch: .062,
      weightX: .020, weightZ: .009, suspensionTravel: .062, suspensionResponse: 8,
      wheelBase: 2.94, steerResponse: 7.5, cornerGrip: .94,
      visual: { body: 'coupe', wheelScale: 1.03, track: 1.04, roof: .88, aero: .9, ride: .015, stripe: .58 }
    },
    3: {
      key: 'heavy', tag: 'DRIFT BLINDADO',
      speedMultiplier: .92, handling: .95, nitroEfficiency: .95,
      acceleration: 11.8, deceleration: 34, nitroAcceleration: 27,
      steeringForce: 44, steeringUpgrade: 5.8, lateralGain: .68,
      dryGrip: .98, wetGrip: .82, brakeGrip: .78, airGrip: 1,
      lateralDamping: 9.3, wetDamping: .9, airDamping: 2.8,
      driftScale: 560, visualSteer: .30, visualDrift: .26,
      rollScale: .055, brakeRoll: .045, pitchScale: .012, brakePitch: .05,
      weightX: .014, weightZ: .006, suspensionTravel: .045, suspensionResponse: 13,
      wheelBase: 3.12, steerResponse: 6.7, cornerGrip: 1.14,
      visual: { body: 'armor', wheelScale: 1.08, track: 1.09, roof: 1.14, aero: 1.02, ride: -.015, stripe: .72 }
    },
    4: {
      key: 'phantom', tag: 'DRIFT COMPLETO',
      speedMultiplier: 1.10, handling: 1.15, nitroEfficiency: 1.20,
      acceleration: 14, deceleration: 32, nitroAcceleration: 28,
      steeringForce: 44, steeringUpgrade: 6.6, lateralGain: .76,
      dryGrip: .96, wetGrip: .78, brakeGrip: .72, airGrip: 1,
      lateralDamping: 8.4, wetDamping: 1.0, airDamping: 2.3,
      driftScale: 490, visualSteer: .36, visualDrift: .27,
      rollScale: .06, brakeRoll: .052, pitchScale: .013, brakePitch: .055,
      weightX: .017, weightZ: .007, suspensionTravel: .052, suspensionResponse: 10,
      wheelBase: 2.98, steerResponse: 8.8, cornerGrip: 1.06,
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

      let steerInput = clamp(input.steerInput || 0, -1, 1);
      this.steerState += (steerInput - this.steerState) * smooth(p.steerResponse || 8, dt);
      const steeringTarget = clamp(this.steerState * .46, -.46, .46);
      const roadGrip = airborne ? p.airGrip : wet ? p.wetGrip : brake ? p.brakeGrip : p.dryGrip;
      const steeringForce = (p.steeringForce + upgrade * p.steeringUpgrade) * p.handling;
      const steeringSpeed = clamp(.38 + nextSpeed / 32, .38, 1.12);
      const cornerDemand = clamp(Math.abs(this.steerState) * steeringSpeed * (nextSpeed / Math.max(1, p.wheelBase)) * .18, 0, 1.35);
      const yawTarget = airborne ? 0 : this.steerState * steeringSpeed * roadGrip * (.62 + cornerDemand * .34) / Math.max(1, p.wheelBase);
      this.yawRate += (yawTarget - this.yawRate) * smooth(7.5, dt);
      let lateralVelocity = input.lateralVelocity || 0;
      const lateralForce = (airborne ? steeringForce * .20 : steeringForce * p.lateralGain) * (1 - Math.min(.22, cornerDemand * .12));
      lateralVelocity += this.steerState * lateralForce * steeringSpeed * roadGrip * dt;
      lateralVelocity *= Math.exp((airborne ? -p.airDamping : -p.lateralDamping * roadGrip) * dt);
      if (wet && Math.abs(lateralVelocity) > 1) lateralVelocity *= Math.exp(-p.wetDamping * dt);
      const rawSlipAngle = Math.atan2(lateralVelocity, Math.max(nextSpeed, 4)) - this.yawRate * .18;
      this.slipAngle += (rawSlipAngle - this.slipAngle) * smooth(6, dt);
      const cornerLoad = clamp(Math.abs(this.yawRate) * .72 + Math.abs(this.slipAngle) * 1.8 + Math.abs(this.steerState) * .12, 0, 1);

      const drift = Math.abs(lateralVelocity) * nextSpeed * (1 + Math.abs(this.slipAngle) * .8) / p.driftScale;
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
        x: clamp((input.x || 0) + lateralVelocity * dt, -5.55, 5.55),
        roadGrip,
        drift,
        profile: p
      };
    }

    visuals(input) {
      const p = this.profile || DEFAULT_PROFILE;
      const lateralVelocity = input.lateralVelocity || 0;
      const speed = input.speed || 0;
      const target = input.targetSpeed || 0;
      const brake = !!input.brake;
      const airborne = !!input.airborne;
      const steer = input.steerVisual || 0;
      const slipAngle = input.slipAngle || Math.atan2(lateralVelocity, Math.max(speed, 4));
      const yawRate = input.yawRate || 0;
      const cornerLoad = clamp(input.cornerLoad || 0, 0, 1);
      const rollTarget = clamp(-lateralVelocity * p.rollScale - yawRate * .09 + (brake ? steer * p.brakeRoll : 0), -.45, .45);
      const pitchTarget = clamp((target - speed) * p.pitchScale, -.09, .12) + (brake ? p.brakePitch : 0) + (input.airPitch || 0);
      const steerYaw = clamp(steer * p.visualSteer, -.24, .24);
      const driftYaw = clamp(slipAngle * p.visualDrift, -.18, .18);
      const yawTarget = clamp(steerYaw + driftYaw + yawRate * .08, -.32, .32);
      const weightX = clamp(-lateralVelocity * p.weightX - yawRate * .018, -.11, .11);
      const weightZ = clamp((target - speed) * p.weightZ + cornerLoad * .012, -.06, .06);
      const load = clamp(Math.abs(lateralVelocity) * .035 + Math.abs(target - speed) * .05 + cornerLoad * .32 + (brake ? .28 : 0) + (airborne ? .65 : 0), 0, 1);
      this.suspension += (load - this.suspension) * smooth(p.suspensionResponse, input.dt || 0);
      const wheelLift = (this.suspension - .35) * p.suspensionTravel;
      return { rollTarget, pitchTarget, yawTarget, weightX, weightZ, wheelLift, suspension: this.suspension, profile: p };
    }
  }

  global.DRIFIN_VEHICLE_PROFILES = PROFILES;
  global.DrifinVehicleEngine = DrifinVehicleEngine;
})(window);

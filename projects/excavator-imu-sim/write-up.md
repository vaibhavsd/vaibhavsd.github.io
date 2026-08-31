An interactive excavator grade-control demo — three-link IMU state estimation and forward kinematics feeding closed-loop boom/bucket automation, in the style of the machine control systems I worked on at Caterpillar.

## 1. Project idea

An excavator's bucket tip position depends on three joint angles — boom, stick, bucket — each of which can be sensed with an IMU mounted on that link. Grade-control automation needs to turn those three noisy, drifting sensor streams into a trustworthy bucket-tip position, then use it to hold a target cut level while the operator only drives the stick.

This demo implements that pipeline: one IMU per link, each estimated independently, combined through forward kinematics into a bucket-tip position, and closed under automation on the boom and bucket.

## 2. State estimation

Every link (boom, stick, bucket) carries its own IMU, and every axis of every IMU (roll, pitch, yaw) runs its own 2-state Kalman filter estimating the angle **and** the gyro's bias:

$$x=\begin{bmatrix}\theta\\ b_g\end{bmatrix},\qquad \dot\theta = \omega_g - b_g$$

Each cycle: **predict** by integrating the bias-corrected gyro rate, propagating covariance with a small process noise on angle and a smaller random-walk noise on bias; **update** against a second, noisier measurement — an accel-derived pitch/roll estimate, noisier while the bucket is actively cutting (added vibration), and a lower-rate aided yaw. The Kalman gain weights the two sources by their relative uncertainty, so the filter tracks the true angle tightly while continuously re-estimating the bias term it can't measure directly. The demo's per-link readouts show the live estimate against the (otherwise hidden) true angle and true bias, so you can watch both converge.

## 3. Forward kinematics

The three link-angle estimates feed the excavator's forward kinematics — known link lengths for boom, stick and bucket — to compute the bucket tip's $(x,y)$ position. The demo reports forward-kinematics error against ground truth directly, which is really the estimator error propagated through the linkage: small angle errors near the boom pivot barely move the tip, while the same error at the bucket joint moves it a lot more, so the estimator quality on each link matters differently depending on where it sits in the chain.

## 4. Automation

With the bucket tip located, automation closes the loop on **boom + bucket**: estimated tip elevation error against the operator-set cut level drives boom lift and bucket curl, holding the tip on grade while the operator drives the **stick** manually — a shared-control setup, not full autonomy, matching how real grade-assist excavator systems are typically operated.

## 5. Demo

Drive boom/stick/bucket manually with **W/S**, **A/D**, **Q/E**, toggle automation with **G**, and adjust cut level and IMU noise live. Each link's card shows the live estimate against the (otherwise hidden) ground truth, plus roll/yaw readouts and the gyro bias term being tracked.

<iframe class="demo-frame" src="./excavator-imu-sim.html" title="Excavator Automation interactive demo" loading="lazy"></iframe>
<p class="demo-cap">Live demo — single self-contained HTML file, embedded directly, no build step.</p>

## 6. Summary

- Three independent per-link IMUs, each axis run through its own angle + gyro-bias Kalman filter, fusing gyro-rate integration with a noisier accel-derived measurement.
- Forward kinematics turning the three fused angles into a bucket-tip position, with the demo's error readout showing how estimator error at each joint propagates differently through the linkage.
- Shared-control automation — boom + bucket hold grade automatically while the operator drives the stick — matching how real grade-assist excavator systems split the work.
- Built independently as a personal demo of the kind of IMU-based state estimation and forward-kinematics work I did for Caterpillar's Trimble Control Technologies group — not their code, no proprietary logic.

**Download:** [excavator-imu-sim.html](./excavator-imu-sim.html) — the whole simulation, one self-contained file, no server or install needed.

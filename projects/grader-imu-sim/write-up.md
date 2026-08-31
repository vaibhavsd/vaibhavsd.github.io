An interactive motor grader grade-control demo — mainframe/drawbar IMU state estimation and laser-aided blade elevation feeding closed-loop automation, in the style of the heavy-equipment machine control systems I've worked on.

## 1. Project idea

A motor grader's blade is carried well ahead of the machine on a drawbar/circle assembly, so mainframe pitch alone doesn't tell you where the cutting edge is — the drawbar has its own pitch, and the blade elevation needs a separate, more precise measurement on top of that. Real grade-control systems typically pair a mast-mounted laser receiver (or GNSS) with a blade IMU for exactly this reason.

This demo models that setup: a mainframe IMU, a drawbar IMU, and a laser-receiver-aided elevation channel for the cutting edge, each independently estimated, then closed under blade-lift automation.

## 2. State estimation

All three channels — mainframe pitch, drawbar pitch, cutting-edge elevation — run the same 2-state Kalman filter structure, estimating the quantity **and** its sensor's slowly-drifting bias:

$$x=\begin{bmatrix}\theta\\ b\end{bmatrix},\qquad \dot\theta = u - b$$

Each cycle: **predict** by integrating the bias-corrected rate — gyro rate for the two pitch channels, vertical rate for elevation — with covariance propagated using a small process noise on the state and a smaller random-walk noise on bias; **update** against a second, noisier absolute measurement — an inclinometer-style reading for the pitch channels (noisier while actively cutting, from added vibration), and the mast-mounted laser receiver for elevation. The Kalman gain weights each source by its relative uncertainty, letting the filter track the true value tightly while continuously re-estimating a bias it can't observe directly. Each card shows the live estimate against the (otherwise hidden) true value and true bias, so you can watch the filter converge.

## 3. Automation

With cutting-edge elevation estimated, automation closes the loop on the **blade lift cylinders**: estimated elevation error against the operator-set cut level drives lift rate, holding the edge on grade while the operator drives forward/reverse and raises/lowers the target cut level. The demo also tracks blade speed and pass coverage as the grader works the strip toward final grade.

The demo is a 2D side view showing elevation control only; on the real machine the same architecture also holds cross-slope via the blade's follower lift cylinder, which isn't modeled here.

## 4. Demo

Drive with **A/D**, toggle blade automation with **G** (or fly it manually with **W/S**), and adjust cut level, sensor noise and final grade live. Each estimator card shows the live estimate against the (otherwise hidden) ground truth, plus the bias term the filter is tracking.

<iframe class="demo-frame" src="./grader-imu-sim.html" title="Motor Grader Automation interactive demo" loading="lazy"></iframe>
<p class="demo-cap">Live demo — single self-contained HTML file, embedded directly, no build step.</p>

## 5. Summary

- Two-state (angle/state + bias) Kalman filters fusing rate integration with a noisier absolute measurement — one per sensed quantity (mainframe pitch, drawbar pitch, laser-aided cutting-edge elevation).
- A closed-loop automation controller driving the blade lift cylinders off the fused elevation estimate to hold grade while the operator drives.
- Modeled as elevation-only, matching how real grader grade-control also runs a parallel cross-slope loop on the follower cylinder that this 2D demo leaves out.
- Built independently as a personal demo of the kind of IMU-based state estimation and grade-control automation used in heavy-equipment machine control — original code, no proprietary logic from any employer.

**Download:** [grader-imu-sim.html](./grader-imu-sim.html) — the whole simulation, one self-contained file, no server or install needed.

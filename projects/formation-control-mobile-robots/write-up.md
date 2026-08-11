Implementing formation control algorithms for mobile robots on ROS — from Python scripts in Gazebo simulation to real TurtleBots holding formation in the lab.

## The problem

Getting a single mobile robot to a goal is one problem; keeping a *group* of robots in a fixed geometric formation relative to each other while they move is another. This project focused on the formation control layer itself — given a set of robots that can already navigate and avoid obstacles, how do you make them hold and adjust a formation as a group.

## Process

- Implemented formation control algorithms as Python nodes on ROS, publishing velocity commands to keep each robot at its assigned position relative to the group.
- Simulated the controllers first in Gazebo to validate formation-keeping behavior before touching hardware.
- Ported the same nodes onto TurtleBots — the open-source robot platform — and ran the formation in the physical lab space.

**Note:** path planning and obstacle avoidance used ROS's built-in navigation libraries; the work here was specifically the formation control layer on top of them.

## Algorithms

### Formation control

Basic algorithm to make robots move in a formation — line, triangle, square, etc. This tries to maintain the distance between robots. Turtlebot01 and Turtlebot02 follow the formation control algorithm; the leader robot does either autonomous path planning or an extremum seeking algorithm.

$\dot{x_2}= -(x_2- x_3) - (x_2 - x_1) + (\gamma_2 - \gamma_1) + (\gamma_2 - \gamma_3)$

$\dot{y_2}= -(y_2- y_3) - (y_2 - y_1) + (\beta_2 - \beta_1) + (\beta_2 - \beta_3)$

where $\gamma_2 - \gamma_1$ is the x-distance between robot 1 and 2, and $\gamma_2 - \gamma_3$ is the x-distance between robot 2 and 3.

To decrease the effect of movement of other follower robots, weights are used:

$\dot{x_2}= -(x_2- x_3) + (\gamma_2 - \gamma_3) + 0.2(- (x_2 - x_1) + (\gamma_2 - \gamma_1))$

$\dot{y_2}= -(y_2- y_3) + (\beta_2 - \beta_3) +0.2(- (y_2 - y_1) + (\beta_2 - \beta_1))$

Here $(x_3, y_3)$ is the leader and $(x_2, y_2)$, $(x_1, y_1)$ are the followers.

### Following a leader

$\dot{x_f}= -(x_f - x_l) + (l_x\sin(\Theta_l) + l_y\cos(\Theta_l))$

$\dot{y_f}= -(y_f - y_l) + (-l_x\cos(\Theta_l) + l_y\sin(\Theta_l))$

where $l_y$ is the distance of the follower from the leader's position in the direction it's pointing, and $l_x$ is the distance of the follower from the leader's position perpendicular to that. To make the follower trail the leader by 1m: $l_x = 0$, $l_y = -1$.

To turn $\dot{x_f}$, $\dot{y_f}$ into a $(v, \omega)$ command:

$Error = \sqrt{\dot{x_f}^{2} + \dot{y_f}^{2}}$

$vel= 0.25(1- e^{-2 \cdot Error^2})$ or $vel=max(0.25, Error)$

$\Theta_{desired} = atan2(\dot{y_f}, \dot{x_f})$

$\Theta_{error} = \Theta_{desired} - \Theta_f$

$\omega = K_p \cdot \Theta_{error} + \dot{\Theta}_{desired}$ (the second term is the derivative of $\Theta_{desired}$)

`Output = (vel, w)`

For line formation, set $l_{y,t1}=-1$, $l_{y,t2}=-2$, $l_{x,t1}=0$, $l_{x,t2}=0$. 
For triangle formation, set $l_{y,t1}=-1$, $l_{y,t2}=-1$, $l_{x,t1}=0.5$, $l_{x,t2}=-0.5$ — same controller, different offsets.

### Obstacle avoidance

**Method 1 — potential function.** The potential function:

$$V(x) = \frac{1}{2}(x_1-x_{t1})^2 + \frac{1}{2}(x_2-x_{t2})^2 + B(d(x))$$

with a repulsive term $B(z)$ chosen for the robot, and distance to the obstacle:

$$
d(z)=
\begin{cases}
\sqrt{(x_1- x_o)^2 + (y_1- y_o)^2} - \delta &\text{if } (x_1- x_o)^2 + (y_1- y_o)^2>\delta^2 \\
0 & \text{otherwise}
\end{cases}
$$

The velocity command is then $u= -\nabla V(x)$. For the Turtlebots, the repulsive term used was:

$$
B(z)=
\begin{cases}
\dfrac{10}{(D(z)+0.6)^2} &  \text{if } z \in [0,1.3]\\[4pt]
0   & \text{if } z>1.3
\end{cases}
$$

where $(x_1, y_1)$ is the robot's coordinate, $(x_o, y_o)$ the obstacle's coordinate, and $\delta$ the obstacle's radius.

**Method 2 — basic obstacle avoidance.** Look for obstacles to the left and right; steer left when the obstacle is on the right and vice versa, holding that maneuver for a fixed duration (via a counter) before handing back control to the formation controller. This performed noticeably better in practice than the potential-function method, though a basic left/right check like this is bound to fail on a non-convex obstacle.

## Simulation

Writing controller code straight for the hardware, or converting a MATLAB/Python prototype to ROS every iteration, is slow — so the algorithms above were checked on a simulator first. Gazebo was used for the full navigation-stack runs; for quick multi-robot iteration, the **Stage** simulator was also used — it's better suited to homogeneous multi-robot testing since it's lighter weight than Gazebo and drops straight into the same ROS topics the real robots use, so a controller that works in Stage is expected to work on the hardware.

Validation ran as a series of experiments, each isolating one piece of the controller:

1. **Follow-leader via TF lookup** — no formation control, just velocity/heading commands proportional to the follower's relative pose to the leader read straight off the TF tree (ROS's tree of coordinate-frame transforms — e.g. each robot's `base_link` relative to `world` — which it composes automatically to give the relative pose between any two frames on request).
2. **Three-robot formation control** — the weighted Equation Set above, holding line/triangle formations.
3. **Formation error measurement** — quantifying how well line and triangle formations were held during a run.
4. **Potential-function proof of concept** — two robots, one treated as a moving obstacle for the other, to check the repulsive term actually steered around it.
5. **Switching formations** — cycling between a line formation and two triangle formations (1m and 2m spacing) every 20 seconds.
6. **Extremum seeking control** — an alternative to path planning for driving the leader robot.

## Result

The formation controller held the robots' relative positions through both simulated and real-world runs, on manually-driven and autonomously-navigated paths alike.

<div class="yt-grid">
  <div class="yt-embed">
    <button type="button" class="yt-thumb" data-yt="ngqm6D5wsQk" aria-label="Play video: Formation Control Algorithm Application in Turtlebot Simulation">
      <img src="https://img.youtube.com/vi/ngqm6D5wsQk/hqdefault.jpg" alt="Formation Control Algorithm Application in Turtlebot Simulation" loading="lazy" />
      <span class="yt-play" aria-hidden="true"><span class="yt-play-icon"></span></span>
    </button>
    <p class="yt-cap">Formation Control Algorithm Application in Turtlebot Simulation</p>
  </div>

  <div class="yt-embed">
    <button type="button" class="yt-thumb" data-yt="qTLS_VdoDgc" aria-label="Play video: Manual Navigation and Formation Control Algorithm Application on Turtlebots">
      <img src="https://img.youtube.com/vi/qTLS_VdoDgc/hqdefault.jpg" alt="Manual Navigation and Formation Control Algorithm Application on Turtlebots" loading="lazy" />
      <span class="yt-play" aria-hidden="true"><span class="yt-play-icon"></span></span>
    </button>
    <p class="yt-cap">Manual Navigation and Formation Control Algorithm Application on Turtlebots</p>
  </div>

  <div class="yt-embed">
    <button type="button" class="yt-thumb" data-yt="Ihdp94H73rE" aria-label="Play video: Autonomous Navigation and Formation Control Algorithm Application on Turtlebots">
      <img src="https://img.youtube.com/vi/Ihdp94H73rE/hqdefault.jpg" alt="Autonomous Navigation and Formation Control Algorithm Application on Turtlebots" loading="lazy" />
      <span class="yt-play" aria-hidden="true"><span class="yt-play-icon"></span></span>
    </button>
    <p class="yt-cap">Autonomous Navigation and Formation Control Algorithm Application on Turtlebots</p>
  </div>
</div>


# ROS Notes- Setup and Installation Notes

Detailed ROS/TurtleBot installation, setup, and reference commands: [see below](#ros-notes)

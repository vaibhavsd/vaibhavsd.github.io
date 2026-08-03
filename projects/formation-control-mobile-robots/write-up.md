Implementing formation control algorithms for mobile robots on ROS — from Python scripts in Gazebo simulation to real TurtleBots holding formation in the lab.

## The problem

Getting a single mobile robot to a goal is one problem; keeping a *group* of robots in a fixed geometric formation relative to each other while they move is another. This project focused on the formation control layer itself — given a set of robots that can already navigate and avoid obstacles, how do you make them hold and adjust a formation as a group.

## Process

- Implemented formation control algorithms as Python nodes on ROS, publishing velocity commands to keep each robot at its assigned position relative to the group.
- Simulated the controllers first in Gazebo to validate formation-keeping behavior before touching hardware.
- Ported the same nodes onto TurtleBots — the open-source robot platform — and ran the formation in the physical lab space.

**Note:** path planning and obstacle avoidance used ROS's built-in navigation libraries; the work here was specifically the formation control layer on top of them.

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

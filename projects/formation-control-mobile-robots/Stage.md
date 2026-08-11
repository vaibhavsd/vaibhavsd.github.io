## Stage Platform for testing codes in simulation

While developing algorithms for multi-robot system, it is necessary to verify the algorithm on a simulation platform before implementing it on real robots. However writing the code for simulations in MATLAB/Python and then converting it for the ROS platform is a tedious and time-consuming task. 
Stage platform makes it easy to check your algorithms for simulated robots. Given a world map, it can emulate the behavior of the robots. Since it uses ROS, we can simulate the robots on Stage and if the code works well, we are certain that it will work on the hardware. 
You can also use the Gazebo platform to do this.  But Stage is better suited when working with homogeneous robots for testing multi-robot algorithms.
The Stage needs a map server node to launch a 2D map. We also need a 3D world on which the map is based. 
For the robots, we need 3 nodes each. 
- Move base: To launch the base of the robot.
- Fake localization: Since we are not using amcl, we need the fake localization node to locate the robot in the map
- Robot State Publisher: For publishing all the tf_frames of the robot

When adding a new robot to the 3D world in Stage, the robot is introduced with _robot_n_ prefix for all its topics, n being the number of robot starting from 0. This is the default prefix and so we need to add all the other robot topics under the same namespace/prefix.

To launch these nodes, run the launch file.
```bash
roslaunch stage setup.launch 
```
This file launches both Rviz and the .world file. For any experiment, we need a 2D map (for Rviz) and the 3D world. For 2D map, we need a `.yaml` and `.png` file. For the 3D world, we need a `.world` file. To ensure that we get correct visualization, we need to reset the world and yaml file origin pose. The origin can be adjusted by changing the co-ordinates in those files.   
[Here](https://medium.com/@ivangavran/ros-creating-world-file-from-existing-yaml-5b553d31cc53) is a link which explains the procedure to setup the files.

We have 3 world files which can be used for experiments. 
1. Empty.world (World is empty for the robots to move around freely.)
2. Maze.world (World has a couple of walls to move around.)
3. my.world (Real world map of an office area with cubicles, walkway, etc.)
 

To control the robots manually, run these files.
```bash
roslaunch stage keyboard0.launch
roslaunch stage keyboard1.launch
roslaunch stage keyboard2.launch 
```

####  From Bar-Ilan Notes on Multi-robot Systems:
By default, the origin of the map is different in Stage and Rviz. In Stage, the origin is by default at the center of the map while in rviz it is at the lower-left corner. The map’s origin in Stage can be changed by adjusting the floorplan pose in its world file. Rviz reads the map from the /map topic that is published by map_server. Its origin can be changed in the map’s yaml file.

## Experiment 1: Follow leader using TF tree information
This algorithm does not use any formation control. The robots have velocity dependent on the distance from the leader robot's position and orientation.
Pseudocode:
```
linear, angular = listener.lookupTransform('/this_robot_position', '/leader_robot_position', rospy.Time(0))
```
$distance\_from\_leader=\sqrt{linear[0]^2 + linear[1]^2}$
$\phi=atan2(\frac{linear[1]}{linear[0]})$

$v=K'*distance\_from\_leader$
$w= K''\phi$ 
where K' and K'' are constants. 

 
Launch Files:
```
rosrun stage goBehindLeader.py
```
To control the leader robot, you do the usual.
```
roslaunch stage keyboard0.launch
```


## Experiment 2: Formation Control with three Turtlebots
```bash
rosrun stage formation_control.py
```

## Experiment 3: Calculate Formation Error: Line, Triangle formations
Launch Files:
```bash
rosrun stage formerror.py
```
Here, we need to manually move the first robot (Robot 0). Robot 1 and 2 follow the leader robot.
```bash
roslaunch stage keyboard0.launch
``` 
Refer to _Ch. 6- Formation Control_ from _Graph Theoretic Methods in Multiagent Networks_ for the theory behind calculating formation error.

## Experiment 4: Potential Function: Proof of Concept

In this experiment, we need only two robots. Robot 1- colored blue in the Stage world moves towards the point (10, 10). The location of Robot 2 (colored red) is the obstacle location for the Robot 1. If you move Robot 2 close to Robot 1, you'll see Robot 1 changing its path to stay away from this robot while trying to get to its desired location. 

There are two implementations for potential function. One method was calculations on the go and the other used a prebuilt derivative equation of the potential function and used substitution of variables when faced with an obstacle.

Method 1: (Prebuilt derivative function)
```bash
rosrun stage potential.py
``` 

Method 2: Potential function calculations on the go. (**Needs verification.**) 
```bash
rosrun stage potential_method2.py
```
Refer to _Formation Control_ guide which has all the pseudocodes for the formation control algorithms.  

## Experiment 5: Switch between 3 different formations

The robots switch between a line formation, a triangle formation with $1m$ difference and a triangle formation with $2m$ difference every 20 seconds. 
```bash
roslaunch stage formation.launch
```
### Method 1:
Change the variable `method1` from False to True in file `robot1.py`
 Pseudocode is based on the Equation Set 1 mentioned in  _Formation Control_ guide.
### Method 2:
Change the variable `method1` from True to False in file `robot1.py`
 Pseudocode is based on the Equation Set 2 mentioned in  _Formation Control_ guide. 


## Experiment 6: Extremum seeking control file for leader robot

```bash
rosrun stage es_t1.py
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbNzMwMzMxNDI0LC01NTA3MDQxNTIsLTE1Nj
k4NzM3OTMsLTE2NjcxODY0MzIsMTE5Njc3NTg3LC0xMjIwNjE2
MzAzLC0xNzAwNjk2MjQxLC0zMTY4Nzg0MDgsLTE5NzAzMTExMT
ksLTY4Mzk1ODQ0MiwtNTYxNjI3Mzk4LDE5NTU2Mzk1NjQsNjM0
OTEwMjYzLC0xMTIyNDg4OTMsLTE2NDAwMTUzODEsLTYwOTUwND
I4MywtODAxMzAyNTM2LC00Mjg5MzUxMTBdfQ==
-->
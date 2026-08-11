# Formation Control Algorithms for Turtlebot
The Turtlebots have a map of the 7th floor saved on their PCs. They use this map as a reference and make use of the AMCL node to localize themselves in the map. 
We are using position based control algorithms. So we need the precise location of the robots moving in a map. If the robot has a collision or if the robot is kidnapped, the localization of the robot is affected and the algorithms we developed no longer work. In such a case, restart the robot localization by clicking on the `2D Pose Estimate` button for the corresponding robot from Rviz. Also, make sure that the fixed frame is the frame corresponding to that particular robot. The leader robot uses built-in navigation stack for path planning. The follower robots use formation control algorithms to follow the leader. 

## PART 1: Formation Control Algorithms
This is the basic algorithm to make robots move in a formation- line, triangle, square, etc. 
This algorithm tries to maintain the distance between robots. We make Turtlebot01 and Turtlebot02 follow the formation control algorithm. The leader robot does either autonomous path planning or uses a extremum seeking algorithm.

$\dot{x_2}= -(x_2- x_3) - (x_2 - x_1) + (\gamma_2 - \gamma_1) + (\gamma_2 - \gamma_3)$
$\dot{y_2}= -(y_2- y_3) - (y_2 - y_1) + (\beta_2 - \beta_1) + (\beta_2 - \beta_3)$
where  $\gamma_2 - \gamma_1$ is the x-distance between robot 1 and 2 and  $\gamma_2 - \gamma_3$ is the x-distance between robot 2 and 3

To decrease the effect of movement of other follower robots, we use weights.
**Equation Set 1**
$\dot{x_2}= -(x_2- x_3) + (\gamma_2 - \gamma_3) + 0.2(- (x_2 - x_1) + (\gamma_2 - \gamma_1))$
 $\dot{y_2}= -(y_2- y_3) + (\beta_2 - \beta_3) +0.2(- (y_2 - y_1) + (\beta_2 - \beta_1))$
Here $(x_3, y_3)$  is considered the leader and $(x_2, y_2)$, $(x_1, y_1)$ as the followers. 


### Formation Control Algorithm for following a leader
**Equation Set 2**
$\dot{x_f}= -(x_f - x_l) + (l_xsin(\Theta_l) + l_ycos(\Theta_l))$
$\dot{y_f}= -(y_f - y_l) + (-l_xcos(\Theta_l) + l_ysin(\Theta_l))$

where *ly* is the distance of the follower from the position of the leader robot in the direction it is pointing.
Similarly, *lx* is the distance of the follower from the position of the leader robot in the direction perpendicular to where it is pointing.
To make the follower trail the leader by 1m, make $lx= 0$ and $ly= -1$ 

###  Calculating (v, w) from xdot and ydot

$Error = \sqrt{\dot{x_f}^{2} + \dot{y_f}^{2}}$

$vel= 0.25(1- e^{-2*Error^2})$ or $vel=max(0.25, Error)$

$\Theta_{desired} = atan2(\frac{\dot{y_f}}{\dot{x_f}})$

$\Theta_{error} = \Theta_{desired} - \Theta_f$

$w= K_p * \Theta_{error} + \dot{\Theta_{desired}}$ 
Note: The second term is the derivative of $\Theta_{desired}$.

`Output= (vel,w)`

## PART 2: Obstacle Avoidance Algorithms


### Method 1: Using Potential Function
The potential function is defined as 
$V(x) = \frac{1}{2}(x_1-x_{t1})^2 + \frac{1}{2}(x_2-x_{t2})^2 + B(d(x))$

where we can choose any $B(z)$ which works well for our robot. 
Ex. 
$$
B(z)=
\begin{cases}
 (z-1)^2 ln(\frac{1}{z}), & \text{for } 0\leq z\leq 1\\
0, & \text{for }  z> 1\\
\end{cases}
$$
The distance to the obstacle $d(z)$ is given by
$$
d(z)=
\begin{cases}
\sqrt{(x_1- x_o)^2 + (y_1- y_o)^2} - \delta &\text{if } (x_1- x_o)^2 + (y_1- y_o)^2>\delta^2 \\
0 & \text{otherwise}
\end{cases}
$$
Once, we have the potential function, we can calculate the velocity for the robot as
$u= -\triangledown V(x)$


For the turtlebots, I have chosen the following potential function:
$$
B(z)=
\begin{aligned}
\begin{cases}
\frac{10}{(D(z)+0.6)^2} &  \text{if  } z \text{ }  \epsilon [0,1.3]\\
0   & \text{if  } z>1.3
\end{cases}
\end{aligned}
$$

where
$$
d(z)=
\begin{cases}
\sqrt{(x_1- x_o)^2 + (y_1- y_o)^2} - \delta &\text{if } (x_1- x_o)^2 + (y_1- y_o)^2>\delta^2 \\
0 & \text{otherwise}
\end{cases}
$$
$(x_1, y_1)$ being the co-ordinate of the robots, $(x_o, y_o)$ the co-ordinates of the obstacle and $\delta$ the radius of the obstacle.

### Method 2: Basic Obstacle Avoidance
This is exactly what the name suggests. We look for the obstacles to the left and the right. We move the robot to the left when we see obstacle on the right side and vice versa. We also use a `counter` to continue obstacle avoidance for a fixed duration before it jumps to implementing the formation control algorithms. The code is straight forward and should be self-explanatory.  
This performs much better than the potential functions, however a basic obstacle avoidance code is bound to fail in a non-convex obstacle.  

## Launch files for robots
### For Turtlebot 3:
For manual control:
```bash
roslaunch multi_robot_setup keyboard_turtle03.launch
```
For autonomous path planning:
Click on the `2D Nav Goal` button on `Rviz` and then choose a point and its direction on the Rviz Map.
Make sure that the `2D Nav Goal` topic is subscribed to the robot you intend to move using this algorithm. 
For ex. for Turtlebot03, `2D Nav Goal` topic should be subscribed to `/turtle03/move_base_simple/goal`. This is available in the `Tool Properties` panel.

### For follower robots (Turtlebot 1 and 2):

#### Follow leader (Turtlebot 3) using basic obstacle avoidance:
For individual robots:
```bash
rosrun navigation t1_following_t3_boa.py
rosrun navigation t2_following_t3_boa.py
```

Together with a launch file:
```bash
roslaunch navigation follow_leader_boa.launch
```

For line formation, set $ly_{t1}=-1$, $ly_{t2}= -2$, $lx_{t1}=0$ and $lx_{t2}= 0$.
For triangle formation, set  $ly_{t1}=-1$, $ly_{t2}= -1$, $lx_{t1}=0.5$ and $lx_{t2}= -0.5$.
#### Follow leader (Turtlebot 3) using potential function based obstacle avoidance:
(Code needs improvement. Other potential functions can be tried/experimented for better results.)

For individual robots:
```bash
rosrun navigation t1_following_t3_pot.py
rosrun navigation t2_following_t3_pot.py
```

Together with a launch file:
```bash
roslaunch navigation follow_leader_potential.launch
```

#### Maintain triangle formation without obstacle avoidance:
For individual robots:
```bash
rosrun navigation formation_t1.py
rosrun navigation formation_t2.py
```

Together with a launch file:
```bash
roslaunch navigation formation_wo_obstacles.launch
```

### Extremum Seeking Control
For individual robots:
```bash
rosrun navigation es_t1.py
rosrun navigation es_t3.py
```


<!--stackedit_data:
eyJoaXN0b3J5IjpbOTI1NjU3MzAxLDcxMDk0NTE2MywxNjY3Nj
c1OTEsLTEyMjMyNjkwMjEsLTI3MzAxOTY3Nyw5OTEyNTU2MTYs
MTgyMjYxNTM2MV19
-->
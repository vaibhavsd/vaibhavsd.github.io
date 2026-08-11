# ROS Documentation


## ROS Installation

- Removing any previous installation of ROS

  ```bash
  sudo apt-get remove ros-*
  ```
- Installing ROS Indigo
  1. Setting up source list
    ```bash
    sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
    ```
  2. Setup the keys
  ```bash
   sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116
   ```
  3. Installation
   ```bash
   sudo apt-get install ros-indigo-desktop-full
   ```

- Installing Turtlebot Packages

  ```bash
  sudo apt-get install ros-indigo-turtlebot ros-indigo-turtlebot-apps ros-indigo-turtlebot-interactions ros-indigo-turtlebot-simulator ros-indigo-kobuki-ftdi ros-indigo-rocon-remocon ros-indigo-rocon-qt-library ros-indigo-ar-track-alvar-msgs
  ```

- Multimaster Setup for ROS

  This technical report provides a detailed guide for installation and setup for Multimaster FKIE. Kindly follow it when using multimaster for the first time on a robot.

  ```bash
  sudo apt-get install ros-indigo-multimaster-fkie
  ```

## Installing Terminator
You will need a lot of open terminals, organize them on the desktop so that you can comfortably go between them as need.  
Consider using terminator (```sudo apt-get install terminator```) to make this easier.  The attached config file has a layout that is very handy to use.  Copy the file into the ~/.config/terminator folder and launch 'terminator  -l ros'

## Text Editor
Atom text editor is another handy tool when dealing with multiple packages, cpp, launch and python files. It's side rail with folder tree, markdown support, python autocomplete can make handling project easy. Other alternatives include Sublime, Nano, Emacs or Vim. 
Installing Atom:
```bash
sudo add-apt-repository ppa:webupd8team/atom
sudo apt-get update
sudo apt-get install atom
```
 
## Turtlebot Setup for Experiments

### Workspace Setup

- Clone the required repositories from RhodeCode.
	 ```bash
	  cd ~  
	  git clone http://vdeshmukh/Users/vdeshmukh/Formation-Control
	  # replace vdeshmukh before @ with your username
	  cd Formation-Control/
	 ```
- Source the workspace
  ```bash
  source /opt/ros/indigo/setup.bash
  cd ~/Formation-Control/
  catkin_make
  source devel/setup.bash
  ```
	You need to source the workspace everytime you login. To avoid repeating the process, you can add the following lines to your .bashrc or .bash_aliases file.
	```bash
	cd ~
	nano .bashrc # or nano .bash_aliases
	```	
	```bash
	source /opt/ros/indigo/setup.bash # change indigo to your version of ROS.
	source ~/Formation-Control/devel/setup.bash # If your folder is not in the home directory, 
	# make changes accordingly
	```

### Setup ROS MASTER URI and HOSTNAME
- For a Single Master system, 
	Add the following lines to your .bashrc file on PC.
	```bash
	export ROS_MASTER_URI=http://192.168.1.111:11311 # Replace this with your PC's IP address
	export ROS_HOSTNAME=192.168.1.111 # Replace this with your PC's IP address
	```
	For the Turtlebots,
	```bash
	export ROS_MASTER_URI=http://192.168.1.111:11311 # Replace this with your PC's IP address
	export ROS_HOSTNAME=192.168.1.102
	```
- For Multi- Master system,
	On PC
	```bash
	export ROS_MASTER_URI=http://192.168.1.111:11311 # Replace this with your PC's IP address
	export ROS_HOSTNAME=192.168.1.111 # Replace this with your PC's IP address
	```
	For the Turtlebots,
	```bash
	export ROS_MASTER_URI=http://192.168.1.102:11311 # Replace this with your Turtlebot's IP address
	export ROS_HOSTNAME=192.168.1.102
	```

### Multi-Master Setup
- Install multi-master packages
	```
	sudo apt-get install ros-indigo-multimaster-fkie
	```
- On the workstation we launch the node manager.
	```bash
	rosrun node_manager_fkie node_manager
	```
- We need to launch the discovery and sync nodes on all the systems running a `roscore`.
	```bash
	rosrun master_discovery_fkie master_discovery _mcast_group:=224.0.0.1
	rosrun master_sync_skie master_sync
	```
- Run ```roscore``` on any of the system and try ```rostopic list``` to verify if you can communicate and view all the ROS topics.  	

- Refer this [documentation](http://www.iri.upc.edu/files/scidoc/1607-Multi-master-ROS-systems.pdf) for details.


### Experiments
- On the workstation terminal, launch the pc file.
  ```bash
  roslaunch multi_robot_setup pc_file.launch
  ```
- ssh into Turtlebot
  ```bash
  ssh dslam@192.168.1.101 -X # for turtlebot01
  ssh dslam@192.168.1.102 -X # for turtlebot02
  ssh dslam@192.168.1.103 -X # for turtebot03
  ```
	Password for Turtlebot01 and Turtlebot02: **dautonomy**
	Password for Turtlebot03: **dslam**
	


- Sync the clock on the Turtlebot with the clock on the workstation
	```bash
	sudo service ntp stop && sudo ntpdate '192.168.1.111' && sudo service ntp start
	# replace '192.168.1.111' with the hostname name of the workstation running the ntp server
	# ntp server might have to be installed and started if not done already
	```
	The terminal should display output similar to this.
	>  sudo service ntp start [sudo] password for dslam:   
	> * Stopping NTP
	> server ntpd                                           [ OK ]   6 Feb
	> 17:23:51 ntpdate[2367]: adjust time server 192.168.1.111 offset
	> -0.278016 sec  
	> * Starting NTP server ntpd                                           [ OK ] 

- On Turtlebot 1/2/3, launch the setup files

     ```
  roslaunch multi_robot_setup turtle1.launch # for turtlebot01
  roslaunch multi_robot_setup turtle2.launch # for turtlebot02
  roslaunch multi_robot_setup turtle3.launch # for turtebot03
  ```

- To view the robots in Rviz on the workstation, launch the view_navigation file
  ```bash
  roslaunch multi_robot_setup view_navigation.launch
  ```

- To move the robot using keyboard, launch the following files
  ```bash
  roslaunch multi_robot_setup keyboard_turtle01.launch # for turtlebot01
  roslaunch multi_robot_setup keyboard_turtle02.launch # for turtlebot02
  roslaunch multi_robot_setup keyboard_turtle03.launch # for turtlebot03
  ```

-   **2D Pose Estimate**
	For the initial estimate of the robot position, we can either edit the `turtle(n).py` file in the `multi_robot_setup` package (edit line no. 29, 30 and 31 to change the pose) or we can use Rviz. To use Rviz, we need to set the `Tool Properties` ->`2D Pose Estimate` topic as `turtle0n/initialpose` and `Displays`-> `Global Options`-> `Fixed Frame` as `turtle0n/map` where $n$ is the robot under consideration.    
 
	  Note: The robot cannot accept velocity commands from two different nodes. So make sure to terminate the
	  keyboard launch file while controlling the robot via formation control or other python/cpp files.

### Change Default Map
- ssh into Turtlebot
  ```bash
  ssh dslam@192.168.1.101 -X # for turtlebot01
  ssh dslam@192.168.1.102 -X # for turtlebot02
  ssh dslam@192.168.1.103 -X # for turtebot03
  ```
	Password for Turtlebot01 and Turtlebot02: **dautonomy**
	Password for Turtlebot03: **dslam**

- Open the bashrc file in any editor of your choice. 
	```
	nano ~/.bashrc
	```
	At the end of this file, you'll see the map being used for experiments.
	```
	export TURTLEBOT_MAP_FILE=/home/dslam/Desktop/maps/map_04_12_18.yaml
	```
- Change this to use different map instead.
	Available Maps:
	* 7th_floor_full_map_0.025.yaml 
	* 7th_floor_full_map_0.05.yaml 

- Source the .bashrc file or exit the terminal and re-login to see the changes. 

## TF- tree structure
For the turtlebot packages to work, the TF tree should always be connected. 
The general layout of the tf tree is `map-> odom -> base_footprint -> base_link -> all_robot_links`.
The amcl node creates the map->odom link if it finds the odom->base_footprint link on the tf_tree.

When dealing with multiple robots, this tf tree structure should be wrapped in namespace. For ex. If we have two turtlebots, we need two branches
```
 turtle01/map-> turtle01/odom -> turtle01/base_footprint -> turtle01/base_link -> turtle01/all_robot_links
 turtle02/map-> turtle02/odom -> turtle02/base_footprint -> turtle02/base_link -> turtle02/all_robot_links
```
However to view the robots simultaneously in RViz, we need to connect the two maps. RViz needs a fixed reference and a tf link to all the other frames. So we need to create a static tf publisher from from `turtle01/map ->turtle02/map`
It can be created using the following command in a launch file.
```bash
<node name="turtle01_map_to_turtle02_map_publisher" pkg="tf" type="static_transform_publisher" output="screen" args="0 0 0 0 0 0 turtle01/map turtle02/map 100" />
```



## Frequently used ROS/Linux commands
- ROS log file access. The most recent file is in the 'latest' folder in the log. 
	```bash
	cd ~/.ros/log
	```
- Stop a process without its ID. Ex- chrome
	```bash
	pkill chrome
	killall chrome
	```
	
- View the current tf tree.
	```bash
	rosrun tf view_frames
	```
	This generates a pdf with the current tf tree structure in the directory from which this command was executed.

	To view a transformation from /frame1 to /frame2
	```bash
	rosrun tf tf_echo /frame1 /frame2
	```

- Kill all the running nodes in ROS.
	```bash
	killall -9 rosmaster
	killall -9 roscore
	```
- Gmapping and AMCL Turtlebot without namespaces
	1. Without laser
		```bash
		roslaunch turtlebot_bringup minimal.launch --screen
		roslaunch turtlebot_navigation gmapping_demo.launch
		roslaunch turtlebot_navigation amcl_demo.launch 
		```
	2. With laser
		```bash
		roslaunch turtlebot_bringup minimal_with_hokuyo.launch --screen
		roslaunch turtlebot_navigation gmapping_demo_hokuyo.launch
		roslaunch turtlebot_navigation amcl_demo.launch
		```
		To move the robot using keyboard, use the following command.
		```bash
		roslaunch turtlebot_teleop keyboard_teleop.launch --screen
		```
	

- To add your own cpp class to a project, add this to your CMakelists.txt. Here `main.cpp` is your script in which you plan to use your class.
	```bash
	add_executable(main src/main.cpp)
	include_directories(${catkin_INCLUDE_DIRS} include)
	add_library(MyClass src/MyClass.cpp)
	target_link_libraries(main MyClass ${catkin_LIBRARIES})
	```
- Launch a python file.
	1. Run an individual file
		Give executable permission to the file.
		```bash
		chmod +x file.py
		```
		Then run the following command on the terminal
		```bash
		rosrun package_name file.py
		```
	2. Using launch file.
		```bash
		<node pkg="package_name" name="node_name" type="file.py" output="screen" respawn="true"/>
		```
- Launch a cpp file
	1. Run an individual file
	Add this to CMakeLists.txt
		```bash
		add_executable(file src/file.cpp)
		target_link_libraries(file ${catkin_LIBRARIES})
		```
		Then run the following command on the terminal
		```bash
		rosrun package_name file
		```
	2. Using launch file.
		```bash
		<node pkg="package_name" name="node_name" type="file" output="screen" respawn="true"/>
		```
		
## Important References/Links while working with Turtlebots
- ROS documentation: http://wiki.ros.org/ROS/Tutorials
- Turtlebot Documentation: http://wiki.ros.org/Robots/TurtleBot
- Guide for multi-robot navigation and setup: https://answers.ros.org/question/41433/multiple-robots-simulation-and-navigation/
- Adding Hokuyo LIDAR to a turtlebot: http://wiki.ros.org/turtlebot/Tutorials/indigo/Adding%20a%20lidar%20to%20the%20turtlebot%20using%20hector_models%20%28Hokuyo%20UTM-30LX%29
- Multimaster FKIE Guide: http://www.iri.upc.edu/files/scidoc/1607-Multi-master-ROS-systems.pdf
- TF Guide: http://wiki.ros.org/navigation/Tutorials/RobotSetup/TF
- All Gazebo Tutorials: http://gazebosim.org/tutorials
- Gazebo ROS Setup Tutorials: http://gazebosim.org/tutorials?cat=connect_ros
- Launch File Guide: http://wiki.ros.org/roslaunch/Tutorials/Roslaunch%20tips%20for%20larger%20projects

[← Back to write-up](#top)
<!--stackedit_data:
eyJoaXN0b3J5IjpbODMwNDA2ODA4LC0xNDE4NDMxNDI0LDM3MD
MzNzg0LDk0NDM3ODc0OCwtOTc1NjkwNDE1LDIwMjQzMTQ2NDcs
ODM4ODgwMzIyLC0xODI2OTA5NjA1LC0xMDU3NzE4NDI2LDk1Mj
IyMzg1NywtODQzMTE1NzcxLDEzODcwOTM3NjIsLTE0NjMyNjE4
NDAsMTA4Mjg2NDEzNCwtMTgxNTM3NjczNiwtMTIwMTkwODEzNy
wzMzA0ODU2MTYsMTg1MDAzMzgxMSwtMjA1NzIyODQ5NiwxMTMz
MzY5MzM2XX0=
-->
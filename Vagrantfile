# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = '2'

@privileged = <<-SHELL
   echo ************* Update Yum and install yum-utils *************
   yum update
   yum install -y yum-utils  

   echo ************* Install Dependencies ************* 
   yum install -y gcc-c++ make fontconfig bzip2 libpng-devel ruby ruby-devel nano
	 gem install sass

   echo ************* Install Git ************* 
   yum install -y git

   echo ************* Install MongoDB *************
   cp /var/www/html/config/mongodb-org-3.6.repo /etc/yum.repos.d/mongodb-org.repo
   yum install -y mongodb-org
   systemctl start mongod
   systemctl status mongod
   semanage port -a -t mongod_port_t -p tcp 27017

	 echo ************* Install Node.js *************
   curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
   yum install -y nodejs
   npm version

   echo ************* Install Bower and Gulp *************
   npm install -g bower
   npm install -g gulp

   echo ************* Clean up ************* 
   yum clean all
   rm -rf /var/cache/yum
SHELL

@privileged2 = <<-SHELL

SHELL

Vagrant.configure("2") do |config|

  config.vm.box = "bento/centos-7.4"
  config.vm.network "forwarded_port", guest: 8000, host: 8000, host_ip: "127.0.0.1"
	config.vm.network "forwarded_port", guest: 27017, host: 27017, host_ip: "127.0.0.1"
  #config.vm.network "public_network"
  config.vm.synced_folder "./app", "/var/www/html/"
  config.vm.provision "shell", inline: @privileged
end

Vagrant.configure('2') do |config|
  config.vm.box = "bento/ubuntu-18.04"
  config.vm.hostname = 'dartz-dev'
  config.vm.network 'private_network', ip: '123.123.123.195'

  config.vm.provider 'virtualbox' do |v|
    v.gui = true
    v.memory = 4096
    v.cpus = 4
    # Turn off display server
    v.customize ["modifyvm", :id, "--vrde", "off"]
    # Attach an empty CD Drive
    # v.customize ["storageattach", :id, "--storagectl", "IDE", "--port", "0", "--device", "1", "--type", "dvddrive", "--medium", "emptydrive"]
    v.customize ["storageattach", :id, "--storagectl", "IDE Controller", "--port", "0", "--device", "1", "--type", "dvddrive", "--medium", "emptydrive"]

    v.customize ["modifyvm", :id, "--graphicscontroller", "vboxvga"]
    v.customize ["modifyvm", :id, "--audio", "dsound"]
    v.customize ["modifyvm", :id, "--audioout", "on"]
    v.customize ["modifyvm", :id, "--vram", "256"]
    v.customize ['modifyvm', :id, '--clipboard', 'bidirectional']
    v.customize ["guestproperty", "set", :id, "--timesync-threshold", 1000]
  end

  config.vm.synced_folder '.', '/vagrant', disabled: true
  config.vm.synced_folder '.', '/src'

  config.vm.network 'forwarded_port',guest: 8000,host: 8083,host_ip: "127.0.0.1"

  config.vm.provision 'shell',
    path: 'vagrant/provision.sh',
    privileged: false,
    binary: true
end

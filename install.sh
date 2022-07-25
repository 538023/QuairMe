sudo apt update
sudo apt upgrade
sudo apt install git
sudo rm -rf /usr/local/go
wget "https://golang.org/dl/go1.18.4.linux-armv6l.tar.gz" -4
sudo tar -C /usr/local -xvf "go1.18.4.linux-armv6l.tar.gz"
cat >> ~/.bashrc << 'EOF'
export GOPATH=$HOME/go
export PATH=/usr/local/go/bin:$PATH:$GOPATH/bin
EOF
source ~/.bashrc
wget "https://github.com/i-teampraxiszwei/AutoHotspot-Installer/raw/master/AutoHotspot-Setup.tar.xz" -4
tar -xvJf Autohotspot-Setup.tar.xz
cd Autohotspot
echo select option 1 and 7
sudo ./autohotspot-setup.sh
cd ..
git clone https://github.com/i-teampraxiszwei/QuairMe
cd QuairMe
go build
cd ..
sudo bash -c 'cat << EOF > /etc/systemd/system/quairme.service
[Unit]
Description=QuairMe
 
[Service]
Type=simple
User=root
WorkingDirectory=/home/qm/QuairMe
ExecStart=/home/qm/QuairMe/quairme
Restart=always
 # Restart service after 10 seconds if golang service crashes
 RestartSec=10
 
[Install]
WantedBy=multi-user.target
EOF'
sudo systemctl enable quairme
sudo systemctl start quairme
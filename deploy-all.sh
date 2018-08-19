echo 'Backing up node_modules..'
mv ./node_modules ../node_modules_subtile_backup
scp -i "vps1.pem" -r ./ ubuntu@ec2-18-216-219-185.us-east-2.compute.amazonaws.com:pong/
echo 'Restore node_modules...'
mv ../node_modules_subtile_backup ./node_modules
echo 'Done.'

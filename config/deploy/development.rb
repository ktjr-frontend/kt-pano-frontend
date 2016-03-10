set :domain, '10.132.1.244'
set :deploy_to, '/home/deploy/apps/lode-zh-frontend' # dev环境
set :user, 'deploy'    # Username in the server to SSH to.
set :port, '22'     # SSH port number.
set :link_backend_assets, '/home/deploy/apps/lode-backend/current/static/assets'
set :shared_uploads, '/home/deploy/uploads'
set :branch, 'test'
set :common_branch, 'test'
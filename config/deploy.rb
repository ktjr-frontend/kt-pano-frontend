require 'mina/bundler'
# require 'mina/rails'
require 'mina/git'
# require 'mina/rbenv'  # for rbenv support. (http://rbenv.org)
# require 'mina/rvm'    # for rvm support. (http://rvm.io)

# Basic settings:
#   domain       - The hostname to SSH to.
#   deploy_to    - Path to deploy into.
#   repository   - Git repo to clone from. (needed by mina/git)
#   branch       - Branch name to deploy. (needed by mina/git)

if ENV['stage'].nil?
  puts 'Please specify a stage name to deploy!'
  exit
end

set :common_repository, 'git@github.kaitongamc.com:Kaitong/kt-frontend-common.git'
set :repository, 'git@github.kaitongamc.com:Kaitong/kt-lode-frontend.git'
# set :branch, 'master'

load File.expand_path("../deploy/#{ENV['stage']}.rb", __FILE__)

if ENV['stage'] =~ /development/ && !ENV['br'].nil?
  set :branch, ENV['br']
end
if ENV['stage'] =~ /development/ && !ENV['cmbr'].nil?
  set :common_branch, ENV['cmbr']
end
# For system-wide RVM install.
#   set :rvm_path, '/usr/local/rvm/bin/rvm'

# Manually create these paths in shared/ (eg: shared/config/database.yml) in your server.
# They will be linked in the 'deploy:link_shared_paths' step.
set :shared_paths, ['log', 'node_modules', 'bower_components']

# Optional settings:
  
#   set :user, 'deploy'    # Username in the server to SSH to.
#   set :port, '30000'     # SSH port number.
#   set :forward_agent, true     # SSH forward_agent.

# This task is the environment that is loaded for most commands, such as
# `mina deploy` or `mina rake`.
task :environment do
  # If you're using rbenv, use this to load the rbenv environment.
  # Be sure to commit your .ruby-version or .rbenv-version to your repository.
  # invoke :'rbenv:load'

  # For those using RVM, use this to load an RVM version@gemset.
  # invoke :'rvm:use[ruby-1.9.3-p125@default]'
end

# Put any custom mkdir's in here for when `mina setup` is ran.
# For Rails apps, we'll make some of the shared paths that are shared between
# all releases.
task :setup => :environment do
  queue! %[mkdir -p "#{shared_uploads}"]
  queue! %[chmod g+rx,u+rwx "#{shared_uploads}"]

  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/log"]

  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/config"]

  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/node_modules"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/node_modules"]

  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/bower_components"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/bower_components"]

  # queue! %[touch "#{deploy_to}/#{shared_path}/config/database.yml"]
  # queue  %[echo "-----> Be sure to edit '#{deploy_to}/#{shared_path}/config/database.yml'."]
end

desc "Deploys the current version to the server."
task :deploy => :environment do
  to :before_hook do
    # Put things to run locally before ssh
  end
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'common_project:clone'
    invoke :'deploy:link_shared_paths'
    invoke :'bower:install'
    invoke :'grunt:build'
    # invoke :'deploy:link_backend_assets'
    # invoke :'deploy:link_shared_uploads'
    # invoke :'rails:db_migrate'
    # invoke :'rails:assets_precompile'
    invoke :'deploy:cleanup'

    to :launch do
      # queue "grunt server"
    end
  end
end

namespace :common_project do
  task :clone => :environment do
    queue! %[git clone -b #{common_branch} #{common_repository} --depth=1]
    queue %{echo "通用模块clone完成"}
    queue! %[rm app/common && mv kt-frontend-common/app ./app/common -f]
    queue %{echo "通用模块移动组装完成---mv kt-frontend-common/app ./app/common"}
  end
end

namespace :grunt do
  task :setup => :environment do
    queue! %[npm install -g grunt-cli]
  end

  task :build => :environment do
    queue! %[grunt build]
  end
end

namespace :bower do
  task :install => :environment do
    queue! %[npm install]
    queue! %[bower install] 
  end
end

namespace :deploy do
  desc "Link backend compiled assets to dist/assets"
  task :link_backend_assets do
    # link backend assets to for sharing the ./dist as public folder.
    queue %{echo "-----> Link backend assets to dist/assets"}
    queue! %[ln -svf #{link_backend_assets} dist/assets]
  end

  task :link_shared_uploads do
    # link shared uploads the ./dist/uploads.
    queue! %[ln -svf #{shared_uploads} dist/uploads]
  end

end

# For help in making your deploy script, see the Mina documentation:
#
#  - http://nadarei.co/mina
#  - http://nadarei.co/mina/tasks
#  - http://nadarei.co/mina/settings
#  - http://nadarei.co/mina/helpers


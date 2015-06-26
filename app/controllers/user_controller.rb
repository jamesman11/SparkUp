class UserController < BaseController
  skip_before_action :verify_authenticity_token
  def create
    username = params[:username]
    password = params[:password]
    if(User.where(:username => username).empty?)
      User.create(:username => username, :password => password)
    end
    head :OK
  end
end

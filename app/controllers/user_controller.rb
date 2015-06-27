class UserController < BaseController
  skip_before_action :verify_authenticity_token
  def create
    user_data = params[:user_data].symbolize_keys
    profile_data = params[:profile].symbolize_keys
    if(User.where(:username => user_data[:username]).empty?)
      user = User.create(user_data)
      profile = Profile.create(profile_data)
      user.profile = profile
      user.save!
    end
    render :json=>true
  end

  def login
    user_data = params[:user_data].symbolize_keys
    username = user_data[:username]
    password = user_data[:password]
    user = User.where(:username => username, :password => password)
    if user.empty?
      render :text => "Internal server error.", :status => 500
    else
      session[:user_id] = user.first.id
      render :json => true
    end
  end
end

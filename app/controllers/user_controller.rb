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
    head :OK
  end

  def login

  end
end

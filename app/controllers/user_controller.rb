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
      @current_user = user.first
      gon.profile = current_user.profile
      gon.current_user = current_user
      render :json => true
    end
  end

  def sign_out
    session[:user_id] = nil
    render :json => true
  end

  def search
    text = params[:text]
    profiles = Profile.where('name LIKE ? or title LIKE ? or interest LIKE ?', "%#{text}%","%#{text}%","%#{text}%")
    teams = Team.where('name LIKE ? or description LIKE ?', "%#{text}%","%#{text}%")
    results = { :profiles => profiles, :teams => teams}
    render :json => results, :status => 200
  end
end

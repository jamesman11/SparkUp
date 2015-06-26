class BaseController < ApplicationController

  before_filter :authorize, :except => [:login, :export, :preview_timestamp]

  def login_user
    #force login if user password is not stored in db
    user = User.get_item_with_name(session[:user_id].to_s)

    if(user.to_s.empty? || user.password.to_s.empty?)
      session[:user_id] = nil
    else
      user.touch
    end

    return session[:user_id]
  end

  def authorize
    # if session[:user_id].nil?
    #   redirect_to :root
    # else
    #   if !login_user
    #     logger.debug "login redirect, current url=" + request.env["REQUEST_URI"]
    #     session[:login_redirect_url] = request.env["REQUEST_URI"]
    #     redirect_to :controller => 'user', :action => 'login'
    #     return
    #   end
    # end
  end
end
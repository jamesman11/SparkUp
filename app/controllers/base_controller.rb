class BaseController < ApplicationController

  before_filter :authorize, :except => [:login, :export, :preview_timestamp]
  def authorize
    if session[:user_id].nil?
      redirect_to :root
    else
     @current_user = User.find(session[:user_id])
    end
  end

  def current_user
    @current_user = session[:user_id].nil? ? nil : User.find(session[:user_id])
    @current_user
  end
end
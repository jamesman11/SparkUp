class BaseController < ApplicationController

  before_filter :authorize, :except => [:login, :export, :preview_timestamp]
  def authorize
    if !session[:user_id].nil?
     @current_user = User.find(session[:user_id])
    end
  end

  def current_user
    id = session[:user_id].nil? ? 1 : session[:user_id]
    @current_user = User.find(id)
    @current_user
  end
end
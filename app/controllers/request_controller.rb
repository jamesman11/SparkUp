require 'mail'
class RequestController < BaseController
  skip_before_action :verify_authenticity_token
  def create
    request_data = params[:data].symbolize_keys
    request_data.merge!({ :status => "No Response Yet", :what => "lunch"})
    request = Request.create(request_data)
    profile = Profile.where(:user_id => request.owner_id).first
    req_attributes = request.attributes
    req_attributes.merge!({:profile => profile.attributes})
    # mail = Mail.new do
    #   from     'SparkUp <man123v1@163.com>'
    #   to       'huaxianm@gmail.com'
    #   subject  'You got a lunch request'
    #   body     'I love you'
    # end
    #
    # mail.delivery_method :sendmail
    # mail.deliver

    render :json => req_attributes, :status => 200
  end

  def accept
    id = params[:id]
    request = Request.find(id)
    request.update_attributes({:acceptee_id => current_user.id, :repliers => current_user.profile.name, :status => "Accepted"})
    render :json => true
  end

  def decline
    id = params[:id]
    request = Request.find(id)
    request.update_attributes({:acceptee_id => current_user.id, :repliers => current_user.profile.name,:status => "Declined"})
    render :json => true
  end

  def get_sent_requests
    sent_requests = Request.where(:owner_id => current_user.id).map do |req|
      is_recipient_team = req.recipient_type == 0
      profile = is_recipient_team ? Team.find(req.recipient_id) : Profile.find(req.recipient_id)
      req_attributes = req.attributes
      req_attributes.merge({:profile => profile.attributes})
    end
    render :json => sent_requests, :status => 200
  end

  def get_received_requests
    received_requests = Request.where.not(:owner_id => current_user.id).map do |req|
      profile = Profile.where(:user_id => req.owner_id).first
      req_attributes = req.attributes
      req_attributes.merge({:profile => profile.attributes})
    end
    render :json => received_requests, :status => 200
  end
end

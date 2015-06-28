require 'mail'
class RequestController < BaseController
  skip_before_action :verify_authenticity_token
  def create
    request_data = params[:data].symbolize_keys
    request_data.merge!({ :status => "No Response Yet", :what => "lunch"})
    Request.create(request_data)
    # mail = Mail.new do
    #   from     'SparkUp <huaxianm@gmail.com>'
    #   to       'ciciliuchengchen@gmail.com'
    #   subject  'You got a lunch request'
    #   body     'I love you'
    # end
    #
    # mail.delivery_method :sendmail
    # mail.deliver

    render :json => true
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
end

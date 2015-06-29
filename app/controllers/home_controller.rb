class HomeController < BaseController
  def index
    if current_user
      gon.profile = current_user.profile
      gon.current_user = current_user
      gon.teams = Team.all
      all_requests = Request.all
      gon.all_request = all_requests.map do |req|
        profile = Profile.where(:user_id => req.owner_id).first
        req_attributes = req.attributes
        req_attributes.merge({:profile => profile.attributes})
      end
      gon.sent_requests = all_requests.where(:owner_id => current_user.id).map do |req|
        is_recipient_team = req.recipient_type == 0
        profile = is_recipient_team ? Team.find(req.recipient_id) : Profile.find(req.recipient_id)
        req_attributes = req.attributes
        req_attributes.merge({:profile => profile.attributes})
      end
      gon.received_requests = all_requests.where.not(:owner_id => current_user.id).map do |req|
        profile = Profile.where(:user_id => req.owner_id).first
        req_attributes = req.attributes
        req_attributes.merge({:profile => profile.attributes})
      end
    end
  end
end

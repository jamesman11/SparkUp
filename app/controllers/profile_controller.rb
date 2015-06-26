class ProfileController < BaseController
  skip_before_action :verify_authenticity_token
  def create
    debugger
    @profile = Profile.create( profile_params)
  end
end

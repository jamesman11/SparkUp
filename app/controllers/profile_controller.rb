class ProfileController < BaseController
  skip_before_action :verify_authenticity_token
  def create
    @profile = Profile.create( profile_params)
  end

  def update
    hash = params["data"].symbolize_keys.slice(:name,:title,:description,:interest, :location)
    if Profile.find(params[:id]).update_attributes(hash)
      render :json=>true
    else
      render :text => "Internal server error.", :status => 500
    end
  end
end

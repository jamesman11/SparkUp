class HomeController < BaseController
  def index
    if current_user
      gon.profile = current_user.profile
      gon.current_user = current_user
    end
  end
end

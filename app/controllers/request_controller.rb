class RequestController < ApplicationController
  skip_before_action :verify_authenticity_token
  def create
    request_data = params[:data].symbolize_keys
    Request.create(request_data)
    head :ok
  end
end

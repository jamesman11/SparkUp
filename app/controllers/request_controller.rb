class RequestController < ApplicationController
  skip_before_action :verify_authenticity_token
  def create
    debugger
    request_data = params[:data].symbolize_keys
    debugger
    Request.create(request_data)
    debugger
    head :ok
  end
end

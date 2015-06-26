class RequestController < ApplicationController
  def create
    r_when = params[:when]
    r_where = params[:wehre]
    r_what = params[:what]
    r_size = params[:size]
    r_who = params[:who]
    Request.create(:when => r_when, :where => r_where, :what => r_what, :size => r_size, :who => r_who)
    head :ok
  end
end

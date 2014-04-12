class CommentsController < ApplicationController
  def create
    connection_id = params[:connection_id]
    log_id = params[:log_id]
    log = Log.find(log_id)
    log.comments << Comment.create(text: params.require(:comment))
    binding.pry
    render :json => {good: "job"}, :status => 200
  end
end
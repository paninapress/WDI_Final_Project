class LogsController < ApplicationController
  def create
    user = current_user
    connection = Connection.find(params[:connection_id])
    binding.pry
    Log.create_log(connection, {source: params.require(:log)[:source], comment: params[:log][:comment] != "" ? params[:log][:comment] : "n/a", timestamp: params[:log][:date] ? params[:log][:date] : Date.today})
    render :json => Connection.find(params[:connection_id]).as_json(:include => {:logs => {:only => [:source, :comment, :timestamp]}}).as_json
  end

  def destroy
    id = params[:id]
    connection_id = params[:connection_id]
    connection = Connection.find(params[:connection_id])
    Log.find(id).destroy
    render :json => Connection.find(connection_id).as_json(:include => {:logs => {:only => [:source, :comment, :timestamp]}}).as_json
  end
end
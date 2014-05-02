class LogsController < ApplicationController
  def create
    connection = Connection.find(params[:connection_id])
    Log.create_log(connection, {source: params.require(:log)[:source], comment: params[:log][:comment] != "" ? params[:log][:comment] : "n/a", timestamp: params[:log][:date] ? params[:log][:date] : Date.today})
    render :json => Connection.find(params[:connection_id]).as_json(:include => {:logs => {:only => [:id, :source, :comment, :timestamp]}})
  end

  def destroy
    id = params[:id]
    connection_id = params[:connection_id]
    connection = Connection.find(params[:connection_id])
    Log.find(id).destroy
    Connection.recalculate_health(connection)
    render :json => connection.as_json(:include => {:logs => {:only => [:id, :source, :comment, :timestamp]}})
  end
end
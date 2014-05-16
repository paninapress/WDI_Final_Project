class LogsController < ApplicationController
  def create
    connection = Connection.find(params[:connection_id])
    Log.create_log(connection, {source: params[:log][:source], comment: params[:log][:comment] != "" ? params[:log][:comment] : "n/a", timestamp: params[:log][:date] && params[:log][:date].length > 0 ? params[:log][:date] : Date.today})
    render :json => connection.as_json(:include => {:logs => {:only => [:id, :source, :comment, :timestamp]}})
  end

  def destroy
    connection = Connection.find(params[:connection_id])
    Log.destroy(params[:id])
    Connection.recalculate_health(connection)
    render :json => connection.as_json(:include => {:logs => {:only => [:id, :source, :comment, :timestamp]}})
  end
end
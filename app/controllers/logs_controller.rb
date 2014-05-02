class LogsController < ApplicationController
  def create
    user = current_user
    connection = Connection.find(params[:connection_id])
    binding.pry
    log = Log.create_log(connection, {source: params.require(:log)[:source], comment: params[:log][:comment] != "" ? params[:log][:comment] : "n/a", timestamp: params[:log][:date] != "" ? params[:log][:date] : Date.today})
    render :json => {response: log}
  end

  def destroy
    id = params[:id]
    connection_id = params[:connection_id]
    connection = Connection.find(params[:connection_id])
    Log.find(id).destroy
    render :json => {response: connection}
  end
end
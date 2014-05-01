class LogsController < ApplicationController
  def create
    user = current_user
    connection = Connection.find(params[:connection_id])
    log = Log.create_log(connection, {source: params.require(:log)[:source], comment: params[:log][:comment] != "" ? params[:log][:comment] : "n/a", timestamp: params[:log][:date] != "" ? params[:log][:date] : Date.today})
    render :json => {response: log}
  end

  def destroy
    id = params[:id]
    connection_id = params[:connection_id]
    user = current_user
    connection = Connection.find(connection_id)
    log = Log.find(id)
    log.destroy
    updated = Connection.get_connection(user, connection)
    render :json => {response: updated}
  end
end
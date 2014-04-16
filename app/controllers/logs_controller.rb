class LogsController < ApplicationController
  def create
    id = params[:connection_id]
    user = current_user
    connection = Connection.find(id)
    date = params[:log][:date] != "" ? Time.parse(params.require(:log)[:date]) : Time.now
    log = Log.create(source: params.require(:log)[:source], comment: params[:log][:comment], timestamp: date)
    connection.logs << log
    updated = Connection.get_connection(user, connection)
    render :json => {response: updated}
  end
end
class LogsController < ApplicationController
  def create
    id = params[:connection_id]
    user = current_user
    connection = Connection.find(id)
    log = Log.create(source: params.require(:source), comment: params.require(:comment), timestamp: Time.now)
    connection.logs << log
    updated = Connection.get_connection(user, connection)
    render :json => {response: updated}
  end
end
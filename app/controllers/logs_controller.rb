class LogsController < ApplicationController
  def create
    id = params[:connection_id]
    connection = Connection.find(id)
    log = Log.create(source: params.require(:source), timestamp: Time.now)
    connection.logs << log
    binding.pry
    render :json => {response: log}
  end
end
class LogsController < ApplicationController
  def create
    id = params[:id]
    binding.pry
    connection = Connection.find(id)
    connection.logs << Log.create(source: params.require(:source), timestamp: Time.now)
    render :json => {good: "job"}, :status => 200
  end
end
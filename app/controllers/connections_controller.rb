class ConnectionsController < ApplicationController

  before_filter :authenticate_user!

  def collect
    auth = request.env['omniauth.auth'] || nil
    @current_user = current_user
    Connection.collect_data(auth, @current_user) if auth != nil
    redirect_to '/#/dashboard'
  end

  def index
    user = current_user
    contacts = Connection.get_all_connections(user)
    render :json => contacts
  end

  def update
    binding.pry
    connection = Connection.find(params[:id])
    responseData = Connection.update_connection(connection, params.require(:category).permit(:connection))
    render :json => {response: responseData}
  end

end
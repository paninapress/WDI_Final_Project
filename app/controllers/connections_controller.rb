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

  def show
  end

  def update
    id = params[:id]
    user = current_user
    connection = Connection.find(id)
    connection.update_attributes(category: params.require(:category))
    responseData = Connection.get_connection(user,connection)
    render :json => {response: responseData}, :status => 200
  end

end
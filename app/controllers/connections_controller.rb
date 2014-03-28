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
    user = current_user
    conn = Connection.find(params[:id])
    connection = Connection.get_connection(user, conn)
    render :json => connection
  end

  def update
    id = params[:id]
    connection = Connection.find(id)
    connection.update_attributes(category: category)
    render :status => 200
  end

end
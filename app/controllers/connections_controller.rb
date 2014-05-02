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
    # contacts = Connection.get_all_connections(user)
    render :json => Connection.where(user_id: user.id).as_json(:include => {:logs => {:only => [:source, :comment, :timestamp]}}).as_json
  end

  def update
    connection = Connection.find(params[:id])
    responseData = Connection.update_connection(connection, params.require(:connection).permit(:category))
    render :json => responseData
  end

end
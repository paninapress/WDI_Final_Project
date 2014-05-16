class ConnectionsController < ApplicationController

  before_filter :authenticate_user!

  def collect
    auth = request.env['omniauth.auth'] || nil
    Connection.collect_data(auth, current_user) if auth != nil
    redirect_to '/#/dashboard'
  end

  def index
    render :json => Connection.where(user_id: current_user.id).as_json(:include => {:logs => {:only => [:id, :source, :comment, :timestamp]}})
  end

  def update
    connection = Connection.find(params[:id])
    Connection.update_connection(connection, params.require(:connection).permit(:category))
    render :json => connection.as_json(:include => {:logs => {:only => [:id, :source, :comment, :timestamp]}})
  end

end
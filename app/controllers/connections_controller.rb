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
    #Step 1: update category
    connection = Connection.find(params[:id])
    category = params.require(:connection).permit(:category)
    connection.update_attributes(category)
    #Step 2: calculate new health
    Connection.calculate_health(connection)

    render :json => connection.as_json(:include => {:logs => {:only => [:id, :source, :comment, :timestamp]}})
  end

end
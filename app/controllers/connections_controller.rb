class ConnectionsController < ApplicationController

  before_filter :authenticate_user!

  def collect
    auth = request.env['omniauth.auth'] || nil
    Connection.collect_data(auth, current_user) if auth != nil
    # create group row for average and overall health
      if current_user.group_id == nil
          Group.create(user_id: current_user.id)
          id = Group.find_by(user_id: current_user.id).id
          current_user.update_attributes(group_id: id)
      end
    redirect_to '/#/dashboard'
  end

  def index
    Connection.decide_to_update(current_user.id)
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
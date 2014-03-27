class UsersController < ApplicationController

  before_filter :authenticate_user!

  def new
  end

  def create
  end

  def omniauth
    auth = request.env['omniauth.auth'] || nil
    @current_user = current_user
    User.create_with_omniauth(auth, @current_user) if auth != nil
    redirect_to '/#/dashboard'
  end

  def show
    user = current_user
    contacts = User.get_contacts(user)
    render :json => contacts
  end

  def update
  end

  def destroy
  end

end
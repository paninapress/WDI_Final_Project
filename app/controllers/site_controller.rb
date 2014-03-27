class SiteController < ApplicationController
  # respond_to :json
    before_filter :authenticate_user!, except: :index

  def index
  end

  def omniauth
    provider = params['provider']
    # call method from user.rb that will return the parsed information
    # from the response that we should already have when this controller method is called
    # and wrap that up in JSON for the Angular controller to collect via $http
    # User.get_info (provider, request.env['omniauth.auth']
    auth = request.env['omniauth.auth'] || nil
    User.create_with_omniauth(auth) if auth != nil
    redirect_to '/#/dashboard'
  end

  def show
    @current_user = current_user
    # # user = User.find(params[:id])
    # contacts = User.get_contacts(@current_user)
    # render :json => contacts
  end


  
end
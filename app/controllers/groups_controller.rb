class GroupsController < ApplicationController
	def index
		render :json => Group.where( id: current_user.group_id).as_json
	end
end
class Connection < ActiveRecord::Base
  belongs_to :user
  belongs_to :contact
  belongs_to :first_name
  belongs_to :last_name
end

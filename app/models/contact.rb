class Contact < ActiveRecord::Base
  has_one :linkedin
  has_many :connections
  has_one :picture
end

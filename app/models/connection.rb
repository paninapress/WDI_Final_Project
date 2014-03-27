class Connection < ActiveRecord::Base
  belongs_to :user
  belongs_to :contact
  belongs_to :first_name
  belongs_to :last_name


  def self.collect_data (auth, user)
    # auth == oauth response object, user = current_user

    linkedin_connections_array = auth.extra.raw_info.connections.values[1]

    # USER CREATION

    l_id = Linkedin.find_by(linkedin_id: auth.uid) || Linkedin.create(linkedin_id: auth.uid)
    # user = current_user || User.find(l_id.user_id)
    # user = User.where(first_name: auth.info.first_name).where(last_name: auth.info.last_name)
    picture = Picture.where(user_id: user.id)[0] || Picture.find_by(linkedin_pic: auth.info.image) || Picture.create(linkedin_pic: auth.info.image)
    # find user & set/update linkedin_id/access_token/linkedin picture
    user.linkedin = l_id
    user.access_token = auth.credentials.token
    user.expires_at = auth.credentials.expires_at
    user.picture = picture
    # find/create corresponding contact to user
    if Contact.find(l_id.contact_id).nil?
      user_contact = Contact.create()
      user_contact.linkedin = l_id
    else 
      user_contact = Contact.find(l_id.contact_id) 
    end
    user_contact.linkedin = l_id
    user_contact.picture = picture

    # create/update user's connections:
    linkedin_connections_array.each do |c|
      # 1.a) look for existing LinkedIN ID in DB
      if Linkedin.find_by(linkedin_id: c.id)
        contact = Contact.find(Linkedin.find_by(linkedin_id: c.id).contact_id)
      # 1.b) if not in DB, need to create the contact
      else
        contact = Contact.create()
        contact.linkedin = Linkedin.create(linkedin_id: c.id)
      end
      # 2) create/update the connection between user and contact
      connection = Connection.where(user_id: user.id).where(contact_id: contact.id)
        # create connection if none exist
      if (connection.empty?)
        connection = Connection.create()
        user.connections << connection
        contact.connections << connection
      end
      # create/update names/picture
      first_name = FirstName.find_by(name: c['firstName']) || FirstName.create(name: c['firstName'])
      last_name = LastName.find_by(name: c['lastName']) || LastName.create(name: c['lastName'])
      picture = Picture.find_by(contact_id: c.id) || Picture.find_by(linkedin_pic: c.pictureUrl) || Picture.create(linkedin_pic: c.pictureUrl)
      first_name.connections << connection
      last_name.connections << connection
      contact.picture = picture
    end
  end



  def self.get_all_connections(user)
    # assemble a 'contacts' array with all of the user's connections
    # need first_name, last_name, linkedin_id, category
    connections = []
    list = Connection.where(user_id: user.id)
    list.each do |connection|
      item = {
              connection_id: connection.id,
              linkedin_id: Linkedin.find_by(connection_id: connection.contact_id).linkedin_id,
              first_name: FirstName.find(connection.first_name_id).name,
              last_name: LastName.find(connection.last_name_id).name,
              category: connection.category,
              picture: connection.picture.linkedin_pic
              }
      connections << item
    end
    # return the 'contacts' array
    contacts
  end

  def self.get_connection(user, connection)
    contact = Contact.find(connection.contact_id)
    item = {
            linkedin_id: contact.linkedin,
            first_name: FirstName.find(connection.first_name_id).name,
            last_name: LastName.find(connection.first_name_id).name,
            category: connection.category,
            picture: contact.picture.linkedin_pic
          }
    return item
  end


end

# LinkedIn connections values:
  # linkedin_connections_array.each do |connection|
  #   id             =  connection.id
  #   first_name     =  connection.firstName
  #   last_name      =  connection.lastName
  #   industry       =  connection.industry
  #   location       =  connection.location.name
  #   picture_url    =  connection.pictureUrl
  #   linkedin_url   =  connection.siteStandardProfileRequest.url

# access_token = auth.credentials.token
# token_expiration = auth.credentials.expires_at
# token_expires = auth.credentials.expires

# uid = auth.uid
# first_name = auth.info.first_name
# last_name = auth.info.last_name
# picture = auth.info.image



# Input the following into Angular view for drop-down sorting:
  # <input type="text" ng-model="query" />
  #   <select ng-model="contactSort">
  #     <option value="first_name">First Name</option>
  #     <option value="last_name"> Last Name</option>
  #     <option value="category">Category</option>
  #   </select>
  # <div ng-repeat="contact in contacts | filter: query | orderBy: contactSort">
  #   ...
  # </div>